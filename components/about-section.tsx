import { Utensils, Clock, Award, Heart } from "lucide-react"

const features = [
  {
    icon: Utensils,
    title: "وصفات أصيلة",
    description: "وصفات تقليدية توارثناها عبر الأجيال، نحافظ على جوهر المشويات الشرقية الأصيلة."
  },
  {
    icon: Clock,
    title: "طازجة يومياً",
    description: "جميع أطباقنا تُحضر طازجة يومياً باستخدام أجود المكونات المحلية والمستوردة."
  },
  {
    icon: Award,
    title: "جودة حائزة على جوائز",
    description: "حائزون على تقدير الخبراء والزبائن لتميزنا في صناعة المشويات الشرقية."
  },
  {
    icon: Heart,
    title: "مصنوعة بحب",
    description: "كل وجبة تُحضّر بشغف وعناية فائقة، لنجلب الدفء والضيافة إلى موائدكم."
  }
]

export function AboutSection() {
  return (
    <section id="about" className="py-20 px-4 sm:px-6 lg:px-8 bg-secondary">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="font-display text-4xl sm:text-5xl md:text-6xl text-foreground mb-6">
            عن حاتي الأصلي
          </h2>
          <p className="text-muted-foreground max-w-3xl mx-auto text-lg leading-relaxed font-sans">
            منذ أكثر من أربعين عاماً، نقدم في حاتي الأصلي أشهى المشويات الشرقية الأصيلة.
            بدأت رحلتنا بمهمة بسيطة: مشاركة تراث المشويات الغني مع مجتمعنا.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature) => (
            <div
              key={feature.title}
              className="text-center p-8 bg-card rounded-xl border border-border hover:shadow-lg hover:border-primary/30 transition-all duration-300"
            >
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 text-primary mb-5">
                <feature.icon className="w-8 h-8" />
              </div>
              <h3 className="font-display text-2xl text-foreground mb-3">
                {feature.title}
              </h3>
              <p className="text-muted-foreground text-sm leading-relaxed font-sans">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
