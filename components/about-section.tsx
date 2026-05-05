import { Utensils, Clock, Award, Heart } from "lucide-react"

const features = [
  {
    icon: Utensils,
    title: "وصفات أصيلة",
    description: "وصفات تقليدية توارثناها عبر الأجيال، نحافظ على جوهر الحلويات الشرقية الأصيلة."
  },
  {
    icon: Clock,
    title: "طازجة يومياً",
    description: "جميع حلوياتنا تُحضر طازجة يومياً باستخدام أجود المكونات المحلية والمستوردة."
  },
  {
    icon: Award,
    title: "جودة حائزة على جوائز",
    description: "حائزون على تقدير الخبراء والزبائن لتميزنا في صناعة الحلويات الشرقية."
  },
  {
    icon: Heart,
    title: "مصنوعة بحب",
    description: "كل قطعة حلوى تُصنع بشغف وعناية فائقة، لنجلب الدفء والضيافة إلى موائدكم."
  }
]

export function AboutSection() {
  return (
    <section id="about" className="py-20 px-4 sm:px-6 lg:px-8 bg-secondary">
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <div className="text-center mb-16">
          <p className="text-primary uppercase tracking-[0.2em] text-sm mb-3">
            قصتنا
          </p>
          <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl font-bold text-foreground mb-6">
            عن سلسلة متاجر حلويات ياقوت
          </h2>
          <p className="text-muted-foreground max-w-3xl mx-auto text-lg leading-relaxed">
            منذ أكثر من أربعين عاماً، نقدم في سلسلة متاجر حلويات ياقوت أشهى الحلويات الشرقية الأصيلة.
            بدأت رحلتنا بمهمة بسيطة: مشاركة التراث الحلواني الغني مع مجتمعنا.
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature) => (
            <div
              key={feature.title}
              className="text-center p-6 bg-card rounded-lg border border-border hover:shadow-md transition-shadow"
            >
              <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-primary/10 text-primary mb-4">
                <feature.icon className="w-7 h-7" />
              </div>
              <h3 className="font-serif text-xl font-semibold text-foreground mb-2">
                {feature.title}
              </h3>
              <p className="text-muted-foreground text-sm leading-relaxed">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
